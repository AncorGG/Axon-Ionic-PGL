import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private endpoint = 'http://localhost:8080/api/exercises';

  constructor(private http: HttpClient) {}

  getExercises() {
    return this.http.get<any[]>(this.endpoint).toPromise();
  }

}