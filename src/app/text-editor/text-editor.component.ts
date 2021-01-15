import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NgControl,
} from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-text-editor',
  templateUrl: 'text-editor.component.html',
  styleUrls: ['text-editor.component.sass'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TextEditorComponent,
    },
  ],
})
export class TextEditorComponent
  implements ControlValueAccessor, MatFormFieldControl<any>, OnInit, OnDestroy {
  static nextId = 0;

  public control = new FormControl();
  public controlType = 'app-text-editor';
  public focused = false;
  public errorState = false;
  public valueLength = 0;
  private requiredValue = false;
  private placeholderValue: string;

  private subscription = new Subscription();
  readonly stateChanges = new Subject<void>();

  @HostBinding('class.example-floating') get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  @HostBinding('attr.id')
  id = `app-text-editor-${TextEditorComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';

  public onChange = (_: any) => {};
  public onTouched = () => {};

  get empty() {
    return !this.valueLength;
  }

  @Input()
  get placeholder(): string {
    return this.placeholderValue;
  }
  set placeholder(value: string) {
    this.placeholderValue = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this.requiredValue;
  }
  set required(value: boolean) {
    this.requiredValue = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this.control.disabled;
  }
  set disabled(value: boolean) {
    this.control[coerceBooleanProperty(value) ? 'disable' : 'enable']();
    this.stateChanges.next();
  }

  @Input()
  get value(): any | null {
    return this.control.value;
  }
  set value(value: any) {
    this.control.patchValue(value, { emitEvent: false });
    this.stateChanges.next();
  }

  constructor(
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    @Host() private matFormField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }

    this.focusHandler();
    this.valueHandler();
  }

  ngOnInit() {
    this.matFormField.floatLabel = 'always';
    this.valueLength = this.getValueLength(this.control.value);
  }

  public ngOnDestroy() {
    this.stateChanges.complete();
    this.subscription.unsubscribe();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  public setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  public onContainerClick(event: MouseEvent) {}

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private focusHandler(): void {
    this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (this.focused && !origin) {
        this.onTouched();
      }

      /*
       * workaround due to https://github.com/sibiraj-s/ngx-editor/issues/310
       * not work for the case when an initial focus is set on add link or image
       * button  in the toolbar when the editor wasn't initially touched
       * */
      setTimeout(() => {
        this.focused = !!origin;
      });
      this.stateChanges.next();
    });
  }

  private valueHandler(): void {
    const sub = this.control.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.onChange(value);
        this.valueLength = this.getValueLength(value);
        this.errorState = Boolean(this.control.dirty && this.ngControl.errors);
      });

    this.subscription.add(sub);
  }

  private getValueLength(value: string): number {
    const parsedDocument = new DOMParser().parseFromString(value, 'text/html');
    return (parsedDocument.body.innerText || '').length;
  }
}
