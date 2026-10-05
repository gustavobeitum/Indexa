import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  aniversario: string;
  redes: string;
  observacoes: string;
}

export type NovoContato = Omit<Contato, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  private readonly API = `http://${window.location.hostname}:3000/contatos`;

  constructor(private http: HttpClient) {}

  obterContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.API);
  }

  buscarContatoPorId(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.API}/${id}`);
  }

  criarContato(contato: NovoContato): Observable<Contato> {
    return this.http.post<Contato>(this.API, contato);
  }

  editarContato(id: number, contato: NovoContato): Observable<Contato> {
    return this.http.put<Contato>(`${this.API}/${id}`, contato);
  }

  excluirContato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}