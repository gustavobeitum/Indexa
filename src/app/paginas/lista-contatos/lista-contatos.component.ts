import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../componentes/container/container.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { ContatoComponent } from '../../componentes/contato/contato.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { Contato, ContatoService } from '../../services/contato.service';


@Component({
  selector: 'app-lista-contatos',
  imports: [SeparadorComponent, ContainerComponent, CabecalhoComponent,FormsModule, ContatoComponent, RouterLink],
  templateUrl: './lista-contatos.component.html',
  styleUrl: './lista-contatos.component.css'
})
export class ListaContatosComponent implements OnInit {

  title = 'indexa';
  alfabeto: string = 'abcdefghijklmnopqrstuvwxyz'
  contatos: Contato[] = [];

  filtroPorTexto: string = ''

  constructor(private contatoService: ContatoService){}

    ngOnInit() {
    this.carregarContatos();
  }

  carregarContatos() {
    this.contatoService.obterContatos().subscribe({
      next: (contatos) => this.contatos = contatos,
      error: (erro) => console.error('Erro ao carregar contatos', erro)
    });
  }

  excluirContato(id: number) {
    if (!confirm('Deseja realmente excluir este contato?')) return;

    this.contatoService.excluirContato(id).subscribe({
      next: () => this.contatos = this.contatos.filter(c => c.id !== id),
      error: (erro) => console.error('Erro ao excluir contato', erro)
    });
  }

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
