import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from './componentes/container/container.component';
import { CabecalhoComponent } from './componentes/cabecalho/cabecalho.component';
import { SeparadorComponent } from './componentes/separador/separador.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContainerComponent, CabecalhoComponent, SeparadorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'indexa';
  alfabeto: string = 'abcdefghijklmnopqrstuvwxyz'
}
