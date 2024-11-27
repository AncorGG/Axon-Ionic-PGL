import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private endpoint = 'http://localhost:8080/api/routines';

  constructor(private http: HttpClient) {}

  getRoutines() {
    return this.http.get<any[]>(this.endpoint).toPromise();
  }

  getRoutineById(id: number) {
    return this.http.get<any>(`${this.endpoint}/${id}`).toPromise();
  }

  addRoutine(newRoutine: any): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.endpoint}`, newRoutine, { headers }).toPromise();
  }

  updateRoutine(id: number, routine: any): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.endpoint}/${id}`, routine, { headers }).toPromise();
  }

  deleteRoutine(id: number) {
    return this.http.delete(`${this.endpoint}/${id}`).toPromise();
  }
}