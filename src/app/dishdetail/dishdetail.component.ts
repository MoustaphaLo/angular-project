import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { switchMap } from 'rxjs/operators';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DISHES } from '../shared/dishes';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective;
  
  dishIds: string[];
  dishcopy: Dish;
  prev: string;
  next: string;

  commentForm: FormGroup;
  comment: Comment;

  @Input()
  dish:Dish;
  dishes = DISHES;
  errMess: string;
  visibility = 'shown';


  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') public baseURL) { 
                this.createForm()
              }

  ngOnInit(){
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishService.getDish(+params['id']);}))
    .subscribe(dish => {
      this.dish = dish;
      this.dishcopy = dish;
      this.setPrevNext(dish.id);
      this.visibility = 'shown';
    }, errmess => this.errMess = <any>errmess);
  }
  formErrors = {
    'author': '',
    'comment': '',
  }
  validationMessages = {
    'author': {
      'required': 'Name is required',
      'minlength': 'Name must be at least 2 characters long',
      'maxlength': 'Name can not be more than 25 characters long'
    },
    'comment': {
      'required': 'Comment is required',
      'minlength': 'Comment must be at least 1 character'
    }
  };
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: '',
      comment: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  };

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
       .subscribe(dish => {
         this.dish = dish;
         this.dishcopy = dish;
       },
       errmess => {this.dish = null;
                   this.dishcopy = null;
                   this.errMess = <any>errmess});
    this.commentForm.reset({
      author: '',
      rating: '',
      comment: ''
    });
    this.feedbackFormDirective.resetForm();
    
    

  }

  onValueChanged(data?: any) {
    if (this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
