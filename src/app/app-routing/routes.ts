import { AboutComponent } from './../about/about.component';
import { Routes } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { HomeComponent } from '../home/home.component';
import { MenuComponent } from '../menu/menu.component';


export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'menu', component: MenuComponent},
    { path: 'about', component: AboutComponent},
    { path: 'dishdetail/:id', component: DishdetailComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'contactus', component: ContactComponent}
];