import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from '../../../models/actor.model';
import { ActorService } from '../../../services/actor.service';

@Component({
  selector: 'app-actor-form',
  standalone: false,
  templateUrl: './actor-form.component.html',
  styleUrl: './actor-form.component.scss'
})
export class ActorFormComponent implements OnInit {
  actorForm: FormGroup;
  isEditMode = false;
  actorId?: number;
  loading = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private actorService: ActorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.actorForm = this.fb.group({
      actor_id: ['', [Validators.required, Validators.min(1)]],
      first_name: ['', [Validators.required, Validators.maxLength(45)]],
      last_name: ['', [Validators.required, Validators.maxLength(45)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.actorId = +params['id'];
        this.loadActor(this.actorId);
      }
    });
  }

  loadActor(id: number): void {
    this.loading = true;
    this.actorService.getActor(id).subscribe({
      next: (actor) => {
        this.actorForm.patchValue({
          actor_id: actor.actor_id, 
          first_name: actor.first_name,
          last_name: actor.last_name
        });
        this.actorForm.get('actor_id')?.disable();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Aktör bilgileri yüklenirken bir hata oluştu';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.actorForm.invalid) {
      return;
    }
    this.loading = true;
    const actor: Actor = {
      actor_id: this.isEditMode ? this.actorId! : this.actorForm.value.actor_id,
      first_name: this.actorForm.value.first_name,
      last_name: this.actorForm.value.last_name,
      last_update: new Date() 
    };
    if (this.isEditMode && this.actorId) {
      this.actorService.updateActor(actor).subscribe({
        next: () => {
          this.router.navigate(['/actors']);
        },
        error: (err) => {
          this.error = 'Aktör güncellenirken bir hata oluştu';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.actorService.createActor(actor).subscribe({
        next: () => {
          this.router.navigate(['/actors']);
        },
        error: (err) => {
          this.error = 'Aktör oluşturulurken bir hata oluştu';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  get f() {
    return this.actorForm.controls;
  }
}
