import { ContainerComponent } from '../../componentes/container/container.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';

@Component({
  selector: 'app-formulario-contato',
  standalone: true,
  imports: [ContainerComponent, SeparadorComponent, ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './formulario-contato.component.html',
  styleUrl: './formulario-contato.component.css'
})
export class FormularioContatoComponent implements AfterViewInit {
  contatoForm: FormGroup;
  @ViewChild('aniversario') aniversarioInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.contatoForm = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      aniversario: new FormControl(''),
      redes: new FormControl(''),
      observacoes: new FormControl('')
    });
  }

  salvarContato() {
    if (this.contatoForm.valid) {
      console.log("Salvando...");
      console.log(this.contatoForm.value);
    } else {
      console.log('Erro de validação');
    }
  }

  cancelar() {
    console.log('Submissão cancelada');
  }

  ngAfterViewInit() {
    flatpickr(this.aniversarioInput.nativeElement, {
      dateFormat: 'd/m/Y',
      locale: Portuguese,
      disableMobile: true,
    });
  }
}