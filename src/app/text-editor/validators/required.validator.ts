import { AbstractControl } from '@angular/forms';

export function RequiredValidator({
  value,
}: AbstractControl): { [key: string]: any } | null {
  const parsedDocument = new DOMParser().parseFromString(value, 'text/html');
  const innerText = parsedDocument.body.innerText || '';

  if (!innerText.length) {
    return {
      required: true,
    };
  }
  return null;
}
