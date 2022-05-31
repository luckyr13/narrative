import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {
  hide = true;

  passwordForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required])
  });
  constructor(
    private _dialogRef: MatDialogRef<PasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
    title: string,
    confirmLabel: string,
    closeLabel: string,
  }) { }

  get password() {
    return this.passwordForm.get('password')!.value;
  }

  set password(password: string) {
    this.passwordForm.get('password')!.setValue(password);
  }

  ngOnInit(): void {
  }

  close(password: string = '') {
    this._dialogRef.close(password);
  }

  onSubmit() {
    this.close(this.password);
  }

}
