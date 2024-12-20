import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RoutineService } from '../../services/routine.service';
import { ExerciseService } from 'src/services/exercise.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  expandedId: number | null = null;
  exercises: any[] = [];
  routines: any[] = [];

  constructor(
    private routineService: RoutineService,
    private exerciseService: ExerciseService,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.fetchRoutines();
    this.fetchExercises();
  }

  
  async fetchExercises() {
    try {
      const data = await this.exerciseService.getExercises();
      this.exercises = data || [];
    } catch (error) {
      console.error('Error fetching exercises:', error);
      this.exercises = [];
    }
  }
  

  async fetchRoutines() {
    try {
      const data = await this.routineService.getRoutines();
      this.routines = data || [];
    } catch (error) {
      console.error('Error fetching routines:', error);
      this.routines = [];
    }
  }

  navigateToRoutine(routineId?: number) {
    if (routineId) {
      this.navCtrl.navigateForward(`/exercise/routines/${routineId}`);
    } else {
      this.navCtrl.navigateForward(`/exercise/routines/new`);
    }
  }

  async deleteRoutine(routineId: number) {
    try {
      await this.routineService.deleteRoutine(routineId);
      this.fetchRoutines();
    } catch (error) {
      console.error('Error deleting routine:', error);
    }
  }

  navigateToExercise(exercise: any) {
    this.navCtrl.navigateForward(`/exercise/test/${exercise.id}`, {
      state: { exercise },
    });
  }

  toggleOptions(routineId: number) {
    this.expandedId = this.expandedId === routineId ? null : routineId;
  }

}
