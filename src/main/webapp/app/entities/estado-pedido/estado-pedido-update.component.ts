import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IEstadoPedido, EstadoPedido } from 'app/shared/model/estado-pedido.model';
import { EstadoPedidoService } from './estado-pedido.service';
import { IPedido } from 'app/shared/model/pedido.model';
import { PedidoService } from 'app/entities/pedido';

@Component({
  selector: 'jhi-estado-pedido-update',
  templateUrl: './estado-pedido-update.component.html'
})
export class EstadoPedidoUpdateComponent implements OnInit {
  estadoPedido: IEstadoPedido;
  isSaving: boolean;

  pedidos: IPedido[];

  editForm = this.fb.group({
    id: [],
    nombre: [],
    descripcion: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected estadoPedidoService: EstadoPedidoService,
    protected pedidoService: PedidoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ estadoPedido }) => {
      this.updateForm(estadoPedido);
      this.estadoPedido = estadoPedido;
    });
    this.pedidoService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPedido[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPedido[]>) => response.body)
      )
      .subscribe((res: IPedido[]) => (this.pedidos = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(estadoPedido: IEstadoPedido) {
    this.editForm.patchValue({
      id: estadoPedido.id,
      nombre: estadoPedido.nombre,
      descripcion: estadoPedido.descripcion
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const estadoPedido = this.createFromForm();
    if (estadoPedido.id !== undefined) {
      this.subscribeToSaveResponse(this.estadoPedidoService.update(estadoPedido));
    } else {
      this.subscribeToSaveResponse(this.estadoPedidoService.create(estadoPedido));
    }
  }

  private createFromForm(): IEstadoPedido {
    const entity = {
      ...new EstadoPedido(),
      id: this.editForm.get(['id']).value,
      nombre: this.editForm.get(['nombre']).value,
      descripcion: this.editForm.get(['descripcion']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstadoPedido>>) {
    result.subscribe((res: HttpResponse<IEstadoPedido>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackPedidoById(index: number, item: IPedido) {
    return item.id;
  }
}
