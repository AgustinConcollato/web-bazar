import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import './PaymentOption.css';

export function PaymentOption({ totalAmount, onChange, allowTwoMethods, setAllowTwoMethods }) {

    const { client } = useContext(AuthContext)

    const [selectedMethods, setSelectedMethods] = useState([]);
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [copied, setCopied] = useState('');

    const paymentOptions =
        client?.type == "final" ?
            ['transfer', 'cash', 'credit_card'] :
            ['transfer', 'cash', 'check', 'credit_card'];

    function handleMethodToggle(method) {
        const isSelected = selectedMethods.includes(method);

        if (isSelected) {
            // Deseleccionar el método
            const updatedMethods = selectedMethods.filter(m => m !== method);
            const { [method]: _, ...restAmounts } = paymentAmounts;
            setSelectedMethods(updatedMethods);
            setPaymentAmounts(restAmounts);
            return;
        }

        const maxMethods = allowTwoMethods ? 2 : 1;
        let updatedMethods;
        let updatedAmounts;
        if (!allowTwoMethods) {
            // Solo un método permitido, reemplazar selección
            updatedMethods = [method];
            updatedAmounts = { [method]: totalAmount };
        } else {
            // Dos métodos permitidos
            if (selectedMethods.length >= maxMethods) return;
            updatedMethods = [...selectedMethods, method];
            updatedAmounts = {
                ...paymentAmounts,
                [method]: 0
            };
        }
        setSelectedMethods(updatedMethods);
        setPaymentAmounts(updatedAmounts);
    }

    function handleAmountChange(method, value) {
        const parsed = parseFloat(value) || 0;
        const updated = {
            ...paymentAmounts,
            [method]: parsed
        };
        setPaymentAmounts(updated);
    }

    function divideEqually() {
        const half = (totalAmount / 2).toFixed(2);
        const [m1, m2] = selectedMethods;
        const newAmounts = {
            ...paymentAmounts,
            [m1]: parseFloat(half),
            [m2]: parseFloat(half),
        };
        setPaymentAmounts(newAmounts);
    }

    useEffect(() => {
        onChange(paymentAmounts);
    }, [paymentAmounts]);

    return (
        <>
            <div className='payment-method-controls'>
                {/* <p>Puede pagar el pedido con dos métodos diferentes</p>
            <label className="allowTwoMethods">
                <input
                    type="checkbox"
                    checked={allowTwoMethods}
                    onChange={() => {
                        setAllowTwoMethods(!allowTwoMethods);
                        setSelectedMethods([]);
                        setPaymentAmounts({});
                    }}
                />
                <span>Usar dos métodos de pago</span>
                <div className={allowTwoMethods ? 'true' : 'false'}>
                    <div className="circle"></div>
                </div>
            </label> */}

                {paymentOptions.map(method => (
                    <div key={method} className='methods'>
                        <label style={selectedMethods.includes(method) ? {
                            outline: '1px solid #1872fa59',
                            outlineOffset: '2px',
                            border: '1px solid #1872fa',
                        } : {}}>
                            <input
                                type={allowTwoMethods ? 'checkbox' : 'radio'}
                                name='payment-method'
                                checked={selectedMethods.includes(method)}
                                onChange={() => handleMethodToggle(method)}
                                disabled={
                                    !selectedMethods.includes(method) &&
                                    allowTwoMethods && selectedMethods.length === 2
                                }
                            />
                            {method === 'transfer' &&
                                <div>
                                    <i className="hgi hgi-stroke hgi-money-exchange-03" />
                                    Transferencia
                                </div>
                            }
                            {method === 'cash' &&
                                <div>
                                    <i className="hgi hgi-stroke hgi-money-03" />
                                    Efectivo
                                </div>
                            }
                            {method === 'check' &&
                                <div>
                                    <i class="hgi hgi-stroke hgi-bank" />
                                    Cheque
                                </div>
                            }
                            {method === 'credit_card' &&
                                <div>
                                    <i className="hgi hgi-stroke hgi-credit-card-pos" />
                                    Tarjeta de crédito / débito
                                </div>
                            }
                        </label>
                        {/* Mostrar input solo si hay más de un método seleccionado */}
                        {selectedMethods.includes(method) && allowTwoMethods && (
                            <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={paymentAmounts[method] || ''}
                                onChange={(e) => handleAmountChange(method, e.target.value)}
                                placeholder="Monto a pagar"
                            />
                        )}
                    </div>
                ))}
                {selectedMethods.length === 2 && (
                    <button onClick={divideEqually} className='btn btn-regular'>Dividir en partes iguales</button>
                )}
            </div>
            {selectedMethods.length > 0 &&
                <div className='info-methods'>
                    {selectedMethods.map(method => (
                        <div key={method} className="method-info">
                            {method === 'transfer' && (
                                <div className="transfer-info">
                                    <h4>Datos para Transferencia</h4>
                                    <p>Mercado Pago</p>
                                    <p>
                                        Titular: Silvano Carlos Concollato
                                    </p>
                                    <p>
                                        CVU: 0000003100017012787205
                                        <button
                                            type="button"
                                            className="btn-copy"
                                            onClick={() => {
                                                navigator.clipboard.writeText('0000003100017012787205');
                                                setCopied('cvu');
                                                setTimeout(() => setCopied(''), 1500);
                                            }}
                                        >
                                            {copied === 'cvu'
                                                ? <>Copiado <i className="hgi hgi-stroke hgi-tick-01"></i></>
                                                : 'Copiar CVU'}
                                        </button>
                                    </p>
                                    <p>
                                        Alias: concoypunto.mp
                                        <button
                                            type="button"
                                            className="btn-copy"
                                            onClick={() => {
                                                navigator.clipboard.writeText('concoypunto.mp');
                                                setCopied('alias');
                                                setTimeout(() => setCopied(''), 1500);
                                            }}
                                        >
                                            {copied === 'alias'
                                                ? <>Copiado <i className="hgi hgi-stroke hgi-tick-01"></i></>
                                                : 'Copiar Alias'}
                                        </button>
                                    </p>
                                </div>
                            )}
                            {method === 'cash' && (
                                <div className="cash-info">
                                    <h4>Pago en Efectivo</h4>
                                    <p>Se realiza al momento de la entrega o retiro.</p>
                                </div>
                            )}
                            {method === 'check' && (
                                <div className="check-info">
                                    <h4>Pago con Cheque</h4>
                                    <p>Entregar el cheque al retirar o coordinar entrega.</p>
                                    <p>El mismo deberá tener una fecha de vencimiento no mayor a 30 días desde su emisión.</p>
                                </div>
                            )}
                            {method === 'credit_card' && (
                                <div className="credit-card-info">
                                    <h4>Pago con Tarjeta</h4>
                                    <p>Se realiza cuando confirmemos el pedido y le enviaremos un link de pago.</p>
                                    <p>Con este método se aplica un <b>recargo</b> del <b>10%</b> sobre el total.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            }
        </>
    );
}
