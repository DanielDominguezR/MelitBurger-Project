/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MelitBurguerTestModule } from '../../../test.module';
import { EstadoPedidoDeleteDialogComponent } from 'app/entities/estado-pedido/estado-pedido-delete-dialog.component';
import { EstadoPedidoService } from 'app/entities/estado-pedido/estado-pedido.service';

describe('Component Tests', () => {
  describe('EstadoPedido Management Delete Component', () => {
    let comp: EstadoPedidoDeleteDialogComponent;
    let fixture: ComponentFixture<EstadoPedidoDeleteDialogComponent>;
    let service: EstadoPedidoService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MelitBurguerTestModule],
        declarations: [EstadoPedidoDeleteDialogComponent]
      })
        .overrideTemplate(EstadoPedidoDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EstadoPedidoDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EstadoPedidoService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
