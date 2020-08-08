import {FormsModel} from './../shared/model/event-form.model';
import {EventBusService} from './../shared/service/event-bus.service';
import {EventFormService} from './../shared/service/event-form.service';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  editEventForm: FormsModel;
  updatedEvent: FormsModel;
  time = false;
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  loaded = false;
  editMode = false;
  minDate: Date;
  dept = ['Computer Science Engineering',
    'Mechanical Engineering',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Civil Engineering',
    'Information Technology'];

  constructor(private eventFormService: EventFormService,
              private eventBusService: EventBusService,
              private r: ActivatedRoute,
              private router: Router) {
    // this.resetForm();
    this.minDate = new Date();
  }

  initForm() {
    this.imgSrc = '../../assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
    let eventName = '';
    let eventCaption = '';
    let eventType = '';
    let eventDate = null;
    let eventTime: Date = null;
    let eventDescription = '';
    let registrationDeadline = null;
    let registrationFees = null;
    let venue = '';
    let department = this.dept[0];
    let eventCordinatorName = '';
    let eventCordinatorContact = '';
    let eventImageUrl = '';
    if (this.editMode) {
      eventName = this.editEventForm.eventName;
      eventImageUrl = this.editEventForm.eventImageUrl;
      eventCaption = this.editEventForm.eventCaption;
      eventType = this.editEventForm.eventType;
      eventDate = this.editEventForm.eventDate.toDate();
      eventTime = this.editEventForm.eventTime.toDate();
      department = this.editEventForm.department;
      eventDescription = this.editEventForm.eventDescription;
      registrationDeadline = this.editEventForm.registrationDeadline.toDate();
      registrationFees = this.editEventForm.registrationFees;
      venue = this.editEventForm.venue;
      eventCordinatorName = this.editEventForm.eventCordinator.cordName;
      eventCordinatorContact = this.editEventForm.eventCordinator.cordContact;
      if (this.editEventForm.eventImageUrl) {
        this.imgSrc = this.editEventForm.eventImageUrl;
      }
    }
    this.eventForm = new FormGroup({
      eventName: new FormControl(eventName, [Validators.required]),
      eventImageUrl: new FormControl(eventImageUrl),
      eventCaption: new FormControl(eventCaption, [Validators.required]),
      eventType: new FormControl(eventType, [Validators.required]),
      eventDate: new FormControl(eventDate, Validators.required),
      eventTime: new FormControl(eventTime, Validators.required),
      eventDescription: new FormControl(eventDescription, Validators.required),
      registrationDeadline: new FormControl(registrationDeadline, Validators.required),
      registrationFees: new FormControl(registrationFees, [Validators.required, Validators.min(0)]),
      venue: new FormControl(venue, Validators.required),
      department: new FormControl(department, Validators.required),
      eventCordinator: new FormGroup({
          cordName: new FormControl(eventCordinatorName, Validators.required),
          cordContact: new FormControl(eventCordinatorContact, Validators.required),
        }
      )
    });
  }

  ngOnInit(): void {
    this.eventBusService.listen('EVENT_TO_EDIT').subscribe(data => {
      this.editMode = true;
      this.editEventForm = data.data;
      this.initForm();
    });
    this.initForm();
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '../../assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  resetForm() {
    this.imgSrc = '../../assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
    this.eventForm.reset();
  }

  some = (url) => {
    this.eventForm.controls.eventImageUrl.setValue(url);
    this.eventFormService.addEvent(this.eventForm.value);
    this.resetForm();
    this.router.navigate(['/']);
  }

  upload(url) {
    this.updatedEvent.eventImageUrl = url;
    this.eventFormService.updateEvent(this.updatedEvent, this.editEventForm.id);
    this.eventForm.reset();
    this.router.navigate(['./'], {relativeTo: this.r.parent});
  }

  updateEvent() {
    let data = {
      participation: this.editEventForm.participation,
      authUID: this.editEventForm.authUID || null,
      ...this.eventForm.value
    };
    if (this.imgSrc === this.editEventForm.eventImageUrl) {
      this.eventFormService.updateEvent({...data}, this.editEventForm.id);
      this.eventForm.reset();
      this.router.navigate([''], {relativeTo: this.r.parent});
    } else {
      const url = this.editEventForm.eventImageUrl;
      this.updatedEvent = data;
      const filePath = `eventImages/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      if (this.editEventForm.eventImageUrl) {
        this.eventFormService.deleteEventImage(url)
          .then(res => {
            if (this.eventForm.valid) {
              if (this.selectedImage) {
                this.eventFormService.uploadEventImage(filePath, this.selectedImage, this.upload.bind(this));
              }
            }
          })
          .catch();
      } else {
        if (this.eventForm.valid) {
          if (this.selectedImage) {
            this.eventFormService.uploadEventImage(filePath, this.selectedImage, this.upload.bind(this));
          }
        }
      }
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.eventForm.valid) {
      if (this.selectedImage) {
        const filePath = `eventImages/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        this.eventFormService.uploadEventImage(filePath, this.selectedImage, this.some.bind(this));
      } else {
        this.eventFormService.addEvent(this.eventForm.value);
        this.resetForm();
      }
    }
  }

}
