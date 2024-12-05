import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutineExerciseService {
  private endPoint = 'http://localhost:8080/api/routine-exercise';

  constructor(private http: HttpClient) {}

  getExerciseByRoutineId(id: number): Observable<any> {
    return this.http.get<any>(`${this.endPoint}/${id}`);
  }

  addExerciseToRoutine(
    routineId: number,
    exerciseId: number,
    sequenceOrder: number
  ): Promise<any> {
    const url = `${this.endPoint}/${routineId}/${exerciseId}/${sequenceOrder}`;
    console.log('Calling API:', url);

    return this.http
      .post(url, {})
      .toPromise()
      .then((response) => {
        console.log('Exercise added successfully:', response);
        return response;
      })
      .catch((error) => {
        console.error('Error adding exercise to routine:', error);
        throw error;
      });
  }
}
