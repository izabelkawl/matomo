import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface DemoForm {
  name: FormControl<string>;
  email: FormControl<string>;
  company: FormControl<string>;
}

@Component({
  selector: 'app-request-demo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="demo-form" aria-label="Formularz zamowienia dema">
      <h2>Popros o spersonalizowane demo</h2>
      <p>Podaj swoje dane, a przeprowadzimy Cie przez konfiguracje trackingu.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <label for="name">Imie i nazwisko</label>
        <input
          id="name"
          type="text"
          formControlName="name"
          aria-label="Imie i nazwisko"
          (focus)="emitStartOnce()"
        />

        <label for="email">Adres e-mail sluzbowy</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          aria-label="Adres e-mail sluzbowy"
          (focus)="emitStartOnce()"
        />

        <label for="company">Firma</label>
        <input
          id="company"
          type="text"
          formControlName="company"
          aria-label="Firma"
          (focus)="emitStartOnce()"
        />

        @if (submitted() && form.invalid) {
          <p class="form-error" role="alert">
            Uzupelnij wszystkie pola i podaj poprawny adres e-mail.
          </p>
        }

        @if (successMessage()) {
          <p class="form-success" role="status">{{ successMessage() }}</p>
        }

        <button type="submit" class="btn btn-primary" aria-label="Wyslij formularz demo">
          Wyslij zgloszenie
        </button>
      </form>
    </section>
  `,
})
export class RequestDemoFormComponent {
  @Output() formStarted = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<void>();

  protected readonly submitted = signal(false);
  protected readonly successMessage = signal('');

  private started = false;
  protected readonly form = new FormGroup<DemoForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    company: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  emitStartOnce(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    this.formStarted.emit();
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmitted.emit();
    this.successMessage.set('Dziekujemy, zgloszenie demo zostalo zapisane w trybie mock.');
    this.form.reset({
      name: '',
      email: '',
      company: '',
    });
    this.started = false;
    this.submitted.set(false);
  }
}
