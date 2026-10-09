import { ContainerComponent } from '../../componentes/container/container.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';

function telefoneValido(control: AbstractControl): ValidationErrors | null {
  const valor = (control.value || '').trim();
  if (!valor) return null; // o Validators.required cuida do vazio
  if (!/^[\d\s()+-]+$/.test(valor)) return { telefoneInvalido: true };
  let digitos = valor.replace(/\D/g, '');
  if (digitos.length > 11 && digitos.startsWith('55')) digitos = digitos.slice(2);
  return /^[1-9]\d{9,10}$/.test(digitos) ? null : { telefoneInvalido: true };
}
@Component({
  selector: 'app-formulario-contato',
  standalone: true,
  imports: [ContainerComponent, SeparadorComponent, ReactiveFormsModule, NgClass, CommonModule, RouterLink],
  templateUrl: './formulario-contato.component.html',
  styleUrl: './formulario-contato.component.css'
})
export class FormularioContatoComponent implements AfterViewInit, OnInit {
  contatoForm!: FormGroup;
  id: number | null = null; // preenchido quando a rota é /formulario/:id (edição)

  private calendario?: flatpickr.Instance;

  @ViewChild('aniversario') aniversarioInput!: ElementRef<HTMLInputElement>;

  constructor(
    private contatoService: ContatoService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    this.contatoForm = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),
      telefone: new FormControl('', [Validators.required, telefoneValido]),
      email: new FormControl('', [Validators.required, Validators.email]),
      aniversario: new FormControl(''),
      redes: new FormControl(''),
      observacoes: new FormControl('')
    });

    const idDaRota = this.route.snapshot.paramMap.get('id');
    if (idDaRota) {
      this.id = Number(idDaRota);
      this.carregarContato(this.id);
    }
  }

  private carregarContato(id: number) {
    this.contatoService.buscarContatoPorId(id).subscribe({
      next: (contato) => {
        const aniversario = this.isoParaBr(contato.aniversario);
        this.contatoForm.patchValue({ ...contato, aniversario });
        this.calendario?.setDate(aniversario, false, 'd/m/Y');
      },
      error: () => this.router.navigate(['/lista-contatos'])
    });
  }

  // aaaa-mm-dd (vem da API) -> dd/mm/aaaa (formato do flatpickr)
    private isoParaBr(data: string): string {
    const [ano, mes, dia] = (data || '').split('-');
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : '';
  }

  salvarContato() {
    if (!this.contatoForm.valid) {
      console.log('Erro de validação');
      return;
    }

    const dados = this.contatoForm.value;
    const requisicao = this.id
      ? this.contatoService.editarContato(this.id, dados)
      : this.contatoService.criarContato(dados);

    requisicao.subscribe({
      next: () => this.router.navigate(['/lista-contatos']),
      error: (erro) => console.error('Erro ao salvar contato', erro.error)
    });
  }

  cancelar() {
    this.router.navigate(['/lista-contatos']);
  }

  ngAfterViewInit() {
    this.calendario = flatpickr(this.aniversarioInput.nativeElement, {
      dateFormat: 'd/m/Y',
      locale: Portuguese,
      disableMobile: true,
    });
  }
}