import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AdminAnimations } from '../admin.animations';

@Component({
  selector: 'users',
  templateUrl: 'users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: AdminAnimations
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  roles: any[] = [];
  editTitle: string;
  errorMessage = '';
  users = new BehaviorSubject<any[]>(null);
  mode = new BehaviorSubject<string>('tableMode');
  selectedUserId = new BehaviorSubject<string>('');
  loading = new BehaviorSubject<boolean>(false);
  processing = new BehaviorSubject<boolean>(false);

  displayedColumns = [
    'FirstName',
    'LastName',
    'UserName',
    'Role',
    'EmailConfirmed'
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.createForm(null);
    this.getRoles();
    this.getUsers();
  }

  ngOnInit() {
    this.cdr.markForCheck();
  }

  editUser(user: any) {
    this.createForm(user);
    this.editTitle = 'Edit user';
    this.selectedUserId.next(user.Id);
    this.mode.next('editMode');
  }

  addUser() {
    this.editTitle = 'Add user';
    this.selectedUserId.next('');
    this.createForm(null);
    this.mode.next('editMode');
  }

  cancelEdit() {
    this.errorMessage = '';
    this.mode.next('tableMode');
    this.getUsers();
  }

  save(data: any) {
    const roles = [];
    const role = { RoleId: data.Role, UserId: this.selectedUserId.getValue() };
    roles.push(role);
    data.Roles = roles;
    data.UserName = data.Email;
  }

  delete(data: any) {
    data.UserName = data.Email;
    data.Id = this.selectedUserId.getValue();
  }

  resetPassword(data: any) {
    this.processing.next(true);
    data.UserName = data.Email;
    data.Id = this.selectedUserId.getValue();
  }

  private createForm(user: any) {
    this.userForm = this.formBuilder.group({
      FirstName: [user === null ? '' : user.FirstName, Validators.required],
      LastName: [user === null ? '' : user.LastName, Validators.required],
      Email: [
        user === null ? '' : user.Email,
        [Validators.required, Validators.email]
      ],
      PhoneNumber: [user === null ? '' : user.PhoneNumber],
      Role: [user === null ? '' : user.Roles[0].Id, Validators.required]
    });
  }

  private getUsers() {}

  private getRoles() {}

  private saveSuccess(message: string) {
    this.mode.next('tableMode');
    this.getUsers();
  }
}
