import { Component, EventEmitter, Output, signal } from '@angular/core';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-section',
  standalone: true,
  template: `
    <section class="faq" aria-label="Najczesciej zadawane pytania">
      <h2>FAQ</h2>
      <div class="accordion-list">
        @for (item of items; track item.id) {
          <article class="accordion-item">
            <button
              type="button"
              class="accordion-trigger"
              [attr.aria-expanded]="openedItemId() === item.id"
              [attr.aria-controls]="'faq-content-' + item.id"
              (click)="toggle(item.id, item.question)"
            >
              <span>{{ item.question }}</span>
              <span class="indicator" [class.open]="openedItemId() === item.id">+</span>
            </button>
            @if (openedItemId() === item.id) {
              <div class="accordion-content" role="region" [attr.id]="'faq-content-' + item.id">
                {{ item.answer }}
              </div>
            }
          </article>
        }
      </div>
    </section>
  `,
})
export class FaqSectionComponent {
  @Output() faqOpened = new EventEmitter<string>();

  protected readonly openedItemId = signal<string>('');
  protected readonly items: FaqItem[] = [
    {
      id: 'tracking-schema',
      question: 'Jak zorganizowane sa eventy w tym demo?',
      answer:
        'Kazdy event korzysta ze schematu category, action, name i value, co ulatwia porzadkowanie analityki.',
    },
    {
      id: 'consent-gating',
      question: 'Czy tracking dziala przed zgoda?',
      answer:
        'Nie. Tracking pozostaje wylaczony, dopoki uzytkownik nie zaakceptuje zgody analitycznej w bannerze.',
    },
    {
      id: 'fallback-mode',
      question: 'Co jesli Matomo jest niedostepne?',
      answer:
        'Aplikacja utrzymuje lokalny strumien podgladu, wiec demo dziala dalej nawet bez dostepu do backendu Matomo.',
    },
  ];

  toggle(id: string, label: string): void {
    const currentlyOpened = this.openedItemId();
    this.openedItemId.set(currentlyOpened === id ? '' : id);

    if (currentlyOpened !== id) {
      this.faqOpened.emit(label);
    }
  }
}
