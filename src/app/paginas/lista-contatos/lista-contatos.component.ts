import { Component } from '@angular/core';
import { ContainerComponent } from '../../componentes/container/container.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { ContatoComponent } from '../../componentes/contato/contato.component';
import agenda from './agenda.json';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';

interface Contato {
  id: number;
  nome: string;
  telefone: string;
}

@Component({
  selector: 'app-lista-contatos',
  imports: [SeparadorComponent, ContainerComponent, CabecalhoComponent,FormsModule, ContatoComponent, RouterLink],
  templateUrl: './lista-contatos.component.html',
  styleUrl: './lista-contatos.component.css'
})
export class ListaContatosComponent {

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
