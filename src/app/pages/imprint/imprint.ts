import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalLayout } from '../../features/legal-layout/legal-layout';
import { BackButton } from '../../shared/back-button/back-button';

@Component({
  selector: 'app-imprint',
  imports: [BackButton, LegalLayout, RouterLink],
  templateUrl: './imprint.html',
})
export class Imprint {}
