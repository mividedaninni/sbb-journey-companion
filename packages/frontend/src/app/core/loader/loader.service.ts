import { computed, Service, Signal, signal, WritableSignal } from '@angular/core';

@Service()
export class LoaderService {
  private activeRequestsCount: WritableSignal<number> = signal(0);
  public isLoading: Signal<boolean> = computed(() => this.activeRequestsCount() > 0);

  public showLoader(): void {
    this.activeRequestsCount.update((count: number): number => count + 1);
  }

  public hideLoader(): void {
    this.activeRequestsCount.update((count: number): number => Math.max(0, count - 1));
  }
}
