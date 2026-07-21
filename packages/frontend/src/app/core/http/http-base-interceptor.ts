import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '~env/environment';

export const httpBaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    const apiReq = req.clone({
      url: `${environment.BACKEND_URL}${req.url}`,
    });
    return next(apiReq);
  }
  return next(req);
};
