import { ContainerComponent } from '../../componentes/container/container.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';

@Component({
  selector: 'app-formulario-contato',
  imports: [ContainerComponent, SeparadorComponent],
  templateUrl: './formulario-contato.component.html',
  styleUrl: './formulario-contato.component.css'
})export class FormularioContatoComponent implements AfterViewInit {
  @ViewChild('aniversario') aniversarioInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    flatpickr(this.aniversarioInput.nativeElement, {
      dateFormat: 'd/m/Y',
      locale: Portuguese,
      disableMobile: true,
    });
  }
}
