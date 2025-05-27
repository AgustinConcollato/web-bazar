import { useEffect, useState } from 'react';
import './PaymentOption.css';

export function PaymentOption({ totalAmount, onChange, allowTwoMethods, setAllowTwoMethods }) {

    const [selectedMethods, setSelectedMethods] = useState([]);
    const [paymentAmounts, setPaymentAmounts] = useState({});

    const paymentOptions = ['transfer', 'cash', 'check'];

    function handleMethodToggle(method) {
        const isSelected = selectedMethods.includes(method);

        if (isSelected) {
            const updatedMethods = selectedMethods.filter(m => m !== method);
            const { [method]: _, ...restAmounts } = paymentAmounts;

            setSelectedMethods(updatedMethods);
            setPaymentAmounts(restAmounts);
            return;
        }

        const maxMethods = allowTwoMethods ? 2 : 1;
        if (selectedMethods.length >= maxMethods) return;

        const updatedMethods = [...selectedMethods, method];
        const updatedAmounts = {
            ...paymentAmounts,
            [method]: allowTwoMethods ? 0 : totalAmount
        };

        setSelectedMethods(updatedMethods);
        setPaymentAmounts(updatedAmounts);
    }


    function handleAmountChange(method, value) {
        const parsed = parseFloat(value) || 0;
        const updated = {
            ...paymentAmounts,
            [method]: parsed
        };

        console.log(updated)
        setPaymentAmounts(updated);
    }

    // Avisá al componente padre siempre que se actualiza paymentAmounts

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
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedMethods.includes(method)}
                            onChange={() => handleMethodToggle(method)}
                            disabled={
                                (!selectedMethods.includes(method) &&
                                    ((allowTwoMethods && selectedMethods.length === 2) ||
                                        (!allowTwoMethods && selectedMethods.length === 1)))
                            }
                        />
                        {method === 'transfer' && 'Transferencia'}
                        {method === 'cash' && 'Efectivo (contra reembolso)'}
                        {method === 'check' && 'Cheque (contra reembolso)'}
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
    );
}
