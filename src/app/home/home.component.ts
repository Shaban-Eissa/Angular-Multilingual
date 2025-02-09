import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  DatePipe,
  DecimalPipe,
  CurrencyPipe,
  CommonModule,
  formatDate,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    TranslateModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  form: FormGroup;

  today = new Date();
  balance = 12345.67;

  locale = 'en';
  selectedLanguage = 'en';

  isLoadingTranslations = false;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.selectedLanguage = savedLanguage;
    this.translate.use(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    this.locale = savedLanguage === 'ar' ? 'ar-EG' : 'en-US';
  }

  onSubmit() {
    if (this.form.valid) {
      alert(this.translate.instant('form.success'));
    }
  }

  changeLanguage(event: Event) {
    this.isLoadingTranslations = true;
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;

    setTimeout(() => {
      this.selectedLanguage = lang;
      this.translate.use(lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('language', lang);
      this.locale = lang === 'ar' ? 'ar-EG' : 'en-US';
      this.isLoadingTranslations = false;
    }, 2000);
  }

  getFormattedDate(): string {
    return formatDate(this.today, 'fullDate', this.locale);
  }

  getFormattedBalance(): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
    }).format(this.balance);
  }
}
