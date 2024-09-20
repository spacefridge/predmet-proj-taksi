// import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export const headerConfigInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {

//   return next(req);
// };
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class HeaderConfigInterceptor implements HttpInterceptor {
	token: string = "";
	constructor() {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const storedUser = sessionStorage.getItem("userData");
		this.token = storedUser ? JSON.parse(storedUser).token : null;
		if (request.url.indexOf("https://localhost:7172/") === 0) {
			request = request.clone({
				headers: new HttpHeaders({
					Authorization: `Bearer ${this.token}`
				})
			});
		}

		return next.handle(request);
	}
}
