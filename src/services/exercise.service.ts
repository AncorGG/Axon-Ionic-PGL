import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private endpoint = 'http://localhost:8080/api/exercises';

  constructor(private http: HttpClient) {}

  async getExercises() {
    return this.http.get<any[]>(this.endpoint).toPromise();
  }

  async getExerciseById(id: number) {
    try {
      return await this.http.get<any>(`${this.endpoint}/${id}`).toPromise();
    } catch (error) {
      console.error('Error fetching exercise by ID:', error);
      throw error;
    }
  }

  async deleteExerciseById(id_routine: number, id_exercise: number) {
    try {
      return await this.http
        .delete<any>(`${this.endpoint}/${id_routine}/${id_exercise}`)
        .toPromise();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }
}
