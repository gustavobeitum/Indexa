import { Component } from '@angular/core';
import agenda from './agenda.json';
import { ContainerComponent } from './componentes/container/container.component';
import { CabecalhoComponent } from './componentes/cabecalho/cabecalho.component';
import { SeparadorComponent } from './componentes/separador/separador.component';
import { ContatoComponent } from './componentes/contato/contato.component';
import { FormsModule } from '@angular/forms';
import { FormularioContatoComponent } from './paginas/formulario-contato/formulario-contato.component';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
}

@Component({
  selector: 'app-root',
  imports: [ContainerComponent, CabecalhoComponent, SeparadorComponent, ContatoComponent, FormsModule,FormularioContatoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'indexa';
  alfabeto: string = 'abcdefghijklmnopqrstuvwxyz'
  contatos: Contato[] = agenda

  filtroPorTexto: string = ''

  private removerAcentos(texto: string): string{
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  filtrarContatosPorTexto(): Contato[] {
    if(!this.filtroPorTexto) {
      return this.contatos
    }
    return this.contatos.filter(contato => {
      return this.removerAcentos(contato.nome).toLowerCase().includes(this.removerAcentos(this.filtroPorTexto).toLowerCase())
    })
  }

  filtrarContatosPorLetraInicial(letra: string): Contato[] {
    return this.filtrarContatosPorTexto().filter(contato => {
      return this.removerAcentos(contato.nome).toLowerCase().startsWith(this.removerAcentos(letra).toLowerCase())
    });
  }
}
