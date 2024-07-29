<div id="modalAgregarNuevoTecnico" class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Registrar nuevo técnico</h5>
                <button class="close" onclick="closeModal('modalAgregarNuevoTecnico')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="formAgregarNuevoTecnico" action="{{ route('ventasIntermediadas.post') }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label class="primary-label" id="dniLabel" for="dniInput">DNI:</label>
                        <input class="input-item" type="number" id="dniInput" placeholder="Ingresar DNI" 
                               oninput="validateInputLength(this, 8)">
                        <label class="primary-label" id="nameLabel"  for="nameInput">Nombre:</label>
                        <input class="input-item" type="text" id="nameInput" placeholder="Ingresar nombre">
                    </div>
                    <div class="form-group">
                        <label class="primary-label" id="phoneLabel" for="phoneInput">Celular:</label>
                        <input class="input-item" type="number" id="phoneInput" placeholder="Ingresar celular"
                               oninput="validateInputLength(this, 9)">
                        <label class="primary-label" id="oficioLabel" for="oficioInput">Oficio:</label>

                        <div class="input-select" id="oficioSelect">
                            @php
                                $idInput = 'oficioInput';
                                $idOptions = 'oficioOptions';
                            @endphp
                            <input class="input-select-item" type="text" id="oficioInput" placeholder="Seleccionar oficio"
                                   readonly oninput="filterOptions('{{ $idInput }}', '{{ $idOptions }}')" 
                                   onclick="toggleOptions('{{ $idOptions }}')" autocomplete="off">
                            <ul class="select-items" id="oficioOptions">
                                <li onclick="selectOption('Albañil', '{{ $idInput }}', '{{ $idOptions }}')">
                                    Albañil
                                </li>
                                <li onclick="selectOption('Enchapador', '{{ $idInput }}', '{{ $idOptions }}')">
                                    Enchapador
                                </li>
                                <li onclick="selectOption('Enchapador/Albañil', '{{ $idInput }}', '{{ $idOptions }}')">
                                    Enchapador/Albañil
                                </li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal('modalAgregarNuevoTecnico')">Cancelar</button>
                <button type="button" class="btn btn-primary" 
                        onclick="guardarModal('modalAgregarNuevoTecnico', 'formAgregarNuevoTecnico')">Guardar</button>
            </div>
        </div>
    </div>
</div>

