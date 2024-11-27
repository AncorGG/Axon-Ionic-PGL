import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService } from 'src/services/routine.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
})
export class RoutinesPage implements OnInit {
  routineId: number | null = null;
  routine: any = {};

  constructor(
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routineId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.routineId) {
      this.loadRoutine();
    }
  }

  async loadRoutine() {
    if(this.routineId !== null) {
      try{
        this.routine = await this.routineService.getRoutineById(this.routineId);
      } catch (err) {
        console.error('Error fetching routine:', err);
      }
    }
  }

  async saveRoutine() {
    try{
      if (this.routineId) {
        await this.routineService.updateRoutine(this.routineId, this.routine);
      } else {
        await this.routineService.addRoutine(this.routine);
      }
      this.router.navigateByUrl('/home');
    } catch (err) {
      console.error('Error saving routine:', err);
    }
  }

}
