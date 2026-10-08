import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkbox), multi: true }],
})
export class Checkbox implements ControlValueAccessor {
  readonly label = input.required<string>();

  protected readonly checked = signal(false);
  protected readonly isDisabled = signal(false);
  protected readonly icon = computed(() =>
    this.checked() ? '/icons/checkbox-checked.svg' : '/icons/checkbox-default.svg',
  );
  protected readonly iconHover = computed(() =>
    this.checked() ? '/icons/checkbox-checked-hover.svg' : '/icons/checkbox-default-hover.svg',
  );

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected toggle(): void {
    this.checked.update((checked) => !checked);
    this.onChange(this.checked());
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}
