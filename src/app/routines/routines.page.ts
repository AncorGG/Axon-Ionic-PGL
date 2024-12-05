import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ExerciseService } from 'src/services/exercise.service';
import { RoutineExerciseService } from 'src/services/routine.exercise.service';
import { RoutineService } from 'src/services/routine.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
})
export class RoutinesPage implements OnInit {
  routineId: number | null = null;
  routine: any = {};
  exercises: any[] = [];
  expandedId: number | null = null;
  isNew: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private exerciseService: ExerciseService,
    private routineExerciseService: RoutineExerciseService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.routineId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.routineId) {
      this.loadRoutine();
      this.loadExercisesOfRoutine();
      this.isNew = false;
    }
  }

  async loadRoutine() {
    if (this.routineId !== null) {
      try {
        this.routine = await this.routineService.getRoutineById(this.routineId);
      } catch (err) {
        console.error('Error fetching routine:', err);
      }
    }
  }

  async loadExercisesOfRoutine() {
    if (this.routineId !== null) {
      try {
        this.routineExerciseService
          .getExerciseByRoutineId(this.routineId)
          .subscribe({
            next: (data) => {
              if (data && data.length > 0) {
                this.exercises = data.map((item: any) => item.exercise);
                console.log('Exercises loaded:', this.exercises);
              } else {
                this.exercises = [];
                console.log('No exercises found for the routine.');
              }
            },
            error: (err) => {
              console.error('Error fetching exercises:', err);
              this.exercises = [];
            },
          });
      } catch (err) {
        console.error('Error fetching exercises:', err);
        this.exercises = [];
      }
    }
  }

  async getExistingRoutineExercises(id: number): Promise<any[]> {
    try {
      return await lastValueFrom(
        this.routineExerciseService.getExerciseByRoutineId(id)
      );
    } catch (error) {
      console.error('Error fetching existing exercises:', error);
      throw error;
    }
  }

  async saveRoutine() {
    if (this.isNew) {
      const newRoutine = {
        routine_name: this.routine.routine_name,
        description: this.routine.description,
      };

      try {
        const createRoutine = await this.routineService.addRoutine(newRoutine);

        if (createRoutine && createRoutine.id_routine) {
          const newRoutineId = createRoutine.id_routine;
          await this.addAllNewExercises(newRoutineId, this.exercises);
        } else {
          console.error('Failed to get the ID of the newly created routine.');
        }
      } catch (error) {
        console.error('Error creating new routine:', error);
      }
    } else {
      if (this.routineId) {
        const id = Number(this.routineId);
        const updatedRoutine = {
          id_routine: id,
          routine_name: this.routine.routine_name,
          description: this.routine.description,
          id_user: 1,
        };

        // Update Routine
        try {
          await this.routineService.updateRoutine(id, updatedRoutine);
        } catch (error) {
          console.error('Error updating routine:', error);
        }

        // Update RoutineExercise
        try {
          const existingRoutineExercises: any[] =
            await this.getExistingRoutineExercises(id);

          if (existingRoutineExercises && existingRoutineExercises.length > 0) {
            const existingExerciseIds = existingRoutineExercises.map(
              (rel) => rel.exercise.id_exercise
            );

            // Find exercises to delete
            const exercisesToDelete = existingExerciseIds.filter(
              (id_exercise: number) =>
                !this.exercises.some(
                  (exercise) => exercise.id_exercise === id_exercise
                )
            );

            for (const id_exercise of exercisesToDelete) {
              await this.handleDeleteExercise(id_exercise);
            }

            await this.addNewExercises(id, existingRoutineExercises);
          } else {
            await this.addAllNewExercises(id, this.exercises);
          }
        } catch (error) {
          console.error('Error managing routine exercises:', error);
        }
      }
    }
  }

  handleAddExercise = async () => {
    try {
      const availableExercises = await this.exerciseService.getExercises();
      const exercisesInRoutine = this.exercises.map((e) => e.id_exercise);

      if (availableExercises) {
        const filteredExercises = availableExercises.filter(
          (exercise) => !exercisesInRoutine.includes(exercise.id_exercise)
        );

        if (filteredExercises.length === 0) {
          console.log('Todos los ejercicios disponibles ya están en la lista.');
          return;
        }

        const newExercise = filteredExercises[0];
        this.exercises = [...this.exercises, newExercise];
        console.log('Exercise added locally:', newExercise);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  async addNewExercises(id: number, existingRoutineExercises: any[]) {
    try {
      const existingExerciseIds = existingRoutineExercises.map(
        (rel) => rel.exercise.id_exercise
      );

      const newExercises = this.exercises.filter(
        (exercise) => !existingExerciseIds.includes(exercise.id_exercise)
      );

      for (const [index, exercise] of newExercises.entries()) {
        const sequence_order = existingRoutineExercises.length + index + 1;
        await this.handleExerciseAddition(
          id,
          exercise.id_exercise,
          sequence_order
        );
      }

      console.log('New exercises added to routine:', newExercises);
    } catch (error) {
      console.error('Error adding new exercises:', error);
    }
  }

  async addAllNewExercises(id: number, tempExercises: any[]) {
    if (!tempExercises || tempExercises.length === 0) {
      console.log('No exercises to add.');
      return;
    }

    for (const [index, exercise] of tempExercises.entries()) {
      const sequence_order = index + 1;
      await this.handleExerciseAddition(
        id,
        exercise.id_exercise,
        sequence_order
      );
    }
  }

  async handleExerciseAddition(
    id: number,
    exerciseId: number,
    sequenceOrder: number
  ) {
    try {
      const result = await this.routineExerciseService.addExerciseToRoutine(
        id,
        exerciseId,
        sequenceOrder
      );

      console.log(
        `Exercise with ID ${exerciseId} successfully added to routine ${id}.`
      );
      return result;
    } catch (error) {
      console.error(
        `Error adding exercise with ID ${exerciseId} to routine:`,
        error
      );
      throw error;
    }
  }

  handleDeleteExercise = async (id_exercise: number) => {
    try {
      const result = await this.exerciseService.deleteExerciseById(
        Number(this.routineId),
        id_exercise
      );
      console.log(
        `Exercise with ID ${id_exercise} removed successfully.`,
        result
      );
    } catch (error) {
      console.error(`Error removing exercise with ID ${id_exercise}:`, error);
    }
  };

  handleRemoveTempExercise = (id_exercise: number) => {
    const updatedTempExercises = this.exercises.filter(
      (exercise) => exercise.id_exercise !== id_exercise
    );
    this.exercises = updatedTempExercises;
  };

  toggleOptions(exerciseId: number) {
    this.expandedId = this.expandedId === exerciseId ? null : exerciseId;
  }

  navigateBack() {
    this.navCtrl.navigateBack(`/home`);
  }
}
