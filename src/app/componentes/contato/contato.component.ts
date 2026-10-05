import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contato',
  imports: [RouterLink],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css'
})
export class ContatoComponent {
  @Input() id!: number;
  @Input() nome: string = '';
  @Input() telefone: string = '';
  @Output() excluir = new EventEmitter<number>();
}