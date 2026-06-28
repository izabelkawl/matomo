import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type FormDefaultAction =
  | 'FORM_ENTER'
  | 'FIELD_CLICK'
  | 'FIELD_FOCUS'
  | 'FIELD_ERROR'
  | 'FORM_SUBMIT';

interface FormDefaultEvent {
  id?: number;
  category: 'FORM_DEFAULT';
  action: FormDefaultAction;
  value?: string;
  at: string;
}

interface AddressForm {
  city: FormControl<string>;
  street: FormControl<string>;
  description: FormControl<string>;
}

type LocalPaqCommand = ['trackEvent', string, string, string];

type MatomoWindow = Window & {
  _paq?: Array<LocalPaqCommand>;
};

@Component({
  selector: 'app-form-default-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="form-default-page" aria-label="Prosty formularz adresowy">
      <section class="form-card">
        <p class="eyebrow">Konfiguracja eventow</p>
        <h1>Formularz FORM_DEFAULT</h1>
        <p class="muted">
          Formularz zbiera eventy: wejscie do formularza, focus pola, blad pola i poprawny submit.
        </p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <label for="city">City (max 10)</label>
          <input
            id="city"
            type="text"
            formControlName="city"
            maxlength="10"
            aria-label="Pole city"
            (click)="trackClick('city')"
            (focus)="trackFocus('city')"
            (blur)="trackFieldError('city')"
          />
          @if (showError('city')) {
            <p class="error" role="alert">City jest wymagane, max 10 znakow.</p>
          }

          <label for="street">Street (max 10)</label>
          <input
            id="street"
            type="text"
            formControlName="street"
            maxlength="10"
            aria-label="Pole street"
            (click)="trackClick('street')"
            (focus)="trackFocus('street')"
            (blur)="trackFieldError('street')"
          />
          @if (showError('street')) {
            <p class="error" role="alert">Street jest wymagane, max 10 znakow.</p>
          }

          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            aria-label="Pole description"
            (click)="trackClick('description')"
            (focus)="trackFocus('description')"
            (blur)="trackFieldError('description')"
          ></textarea>
          @if (showError('description')) {
            <p class="error" role="alert">Description jest wymagane.</p>
          }

          <button type="submit" class="submit-btn" aria-label="Wyslij formularz">Submit</button>
        </form>

        @if (submittedMessage()) {
          <p class="success" role="status">{{ submittedMessage() }}</p>
        }
      </section>

      <section class="events-card" aria-label="Podglad zebranych eventow">
        <h2>Ostatnie eventy</h2>
        <p class="muted">Kategoria: FORM_DEFAULT</p>
        @if (events().length === 0) {
          <p class="muted">Brak eventow.</p>
        } @else {
          <ul>
            @for (event of events(); let i = $index; track i) {
              <li>
                <span>
                  {{ event.id }} <strong>{{ event.action }} </strong>value: {{ event.value ?? '-' }}
                </span>
              </li>
            }
          </ul>
        }
      </section>
    </main>
  `,
  styles: `
    .form-default-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: minmax(0, 640px) minmax(0, 340px);
      gap: 1rem;
      padding: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .form-card,
    .events-card {
      background: #ffffff;
      border: 1px solid #c8d6e6;
      border-radius: 16px;
      padding: 1rem;
      box-shadow: 0 12px 30px rgba(28, 63, 104, 0.12);
    }

    .eyebrow {
      margin: 0;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #0858a7;
      font-weight: 700;
    }

    h1 {
      margin: 0.35rem 0 0.75rem;
    }

    .muted {
      color: #49627d;
      margin: 0 0 0.9rem;
    }

    form {
      display: grid;
      gap: 0.4rem;
    }

    label {
      font-weight: 700;
      margin-top: 0.55rem;
    }

    input,
    textarea {
      border: 1px solid #c8d6e6;
      border-radius: 10px;
      padding: 0.65rem;
      font: inherit;
    }

    input:focus-visible,
    textarea:focus-visible,
    button:focus-visible {
      outline: 3px solid #f49b36;
      outline-offset: 2px;
    }

    .submit-btn {
      margin-top: 0.75rem;
      border: 1px solid transparent;
      border-radius: 10px;
      background: #0b74de;
      color: #ffffff;
      font: inherit;
      font-weight: 700;
      padding: 0.72rem 1rem;
      cursor: pointer;
    }

    .submit-btn:hover {
      background: #0858a7;
    }

    .error {
      color: #b4261a;
      margin: 0.2rem 0 0.1rem;
    }

    .success {
      color: #0b7a2a;
      margin: 0.8rem 0 0;
    }

    .events-card ul {
      margin: 0;
      padding-left: 1.2rem;
      display: grid;
      gap: 0.45rem;
    }

    .events-card li {
      display: grid;
      gap: 0.15rem;
    }

    @media (max-width: 900px) {
      .form-default-page {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class FormDefaultPageComponent implements OnInit {
  protected readonly submittedMessage = signal('');
  protected readonly events = signal<FormDefaultEvent[]>([]);

  protected readonly form = new FormGroup<AddressForm>({
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(10)],
    }),
    street: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(10)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.track('FORM_ENTER', '');
  }

  protected trackFocus(fieldName: 'city' | 'street' | 'description'): void {
    this.track('FIELD_FOCUS', fieldName);
  }

  protected trackClick(fieldName: 'city' | 'street' | 'description'): void {
    this.track('FIELD_CLICK', fieldName);
  }

  protected trackFieldError(fieldName: keyof AddressForm): void {
    const control = this.form.controls[fieldName];
    if (control.invalid && (control.touched || control.dirty)) {
      this.track('FIELD_ERROR', fieldName);
    }
  }

  protected showError(fieldName: keyof AddressForm): boolean {
    const control = this.form.controls[fieldName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.getInvalidFields().forEach((fieldName) => {
        this.track('FIELD_ERROR', fieldName);
      });
      this.submittedMessage.set('Formularz ma bledy walidacji.');
      return;
    }

    this.track('FORM_SUBMIT', 'submit_success');
    this.submittedMessage.set('Formularz wyslany poprawnie.');
    this.form.reset({ city: '', street: '', description: '' });
  }

  private getInvalidFields(): Array<keyof AddressForm> {
    const invalidFields: Array<keyof AddressForm> = [];

    if (this.form.controls.city.invalid) {
      invalidFields.push('city');
    }
    if (this.form.controls.street.invalid) {
      invalidFields.push('street');
    }
    if (this.form.controls.description.invalid) {
      invalidFields.push('description');
    }

    return invalidFields;
  }

  private track(action: FormDefaultAction, value?: string): void {
    const event: FormDefaultEvent = {
      category: 'FORM_DEFAULT',
      action,
      value,
      at: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    this.events.update((events) => [{ ...event, id: events.length }, ...events.slice(0, 9)]);

    console.log('trackedWindowWorking?');
    // @ts-ignore
      _paq.push(['trackEvent', event.category, event.action, event.value ?? '']);
    }
}
