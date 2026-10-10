import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalLayout } from '../../features/legal-layout/legal-layout';
import { BackButton } from '../../shared/back-button/back-button';

const PLACEHOLDER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque odio felis, iaculis ut massa eget, ornare lacinia urna. In dignissim justo eu velit sagittis, in scelerisque nulla convallis. Vestibulum eros lorem, sollicitudin eget eros non, varius aliquam mauris. Sed turpis ipsum, condimentum quis nulla at, lobortis facilisis ipsum. Nunc erat justo, hendrerit vel enim vitae, feugiat mattis dui. In auctor dignissim luctus. Mauris ornare ipsum at ultrices eleifend. Praesent tempus congue magna. Quisque libero erat, pharetra a neque et, imperdiet semper justo.';

@Component({
  selector: 'app-privacy-policy',
  imports: [BackButton, LegalLayout, RouterLink],
  templateUrl: './privacy-policy.html',
})
export class PrivacyPolicy {
  protected readonly sections = [
    { title: 'Subtitle', text: PLACEHOLDER },
    { title: 'Subtitle', text: PLACEHOLDER },
    { title: 'Subtitle', text: `${PLACEHOLDER} ${PLACEHOLDER}` },
  ];
}
