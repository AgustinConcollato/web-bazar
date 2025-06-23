import { useEffect, useState } from 'react';
import './PaymentOption.css';

export function PaymentOption({ totalAmount, onChange, allowTwoMethods, setAllowTwoMethods }) {

    const [selectedMethods, setSelectedMethods] = useState([]);
    const [paymentAmounts, setPaymentAmounts] = useState({});

    const paymentOptions = ['transfer', 'cash', 'check'];

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
                            type={allowTwoMethods ? 'checkbox' : 'radio'}
                            name='payment-method'
                            checked={selectedMethods.includes(method)}
                            onChange={() => handleMethodToggle(method)}
                            disabled={
                                !selectedMethods.includes(method) &&
                                allowTwoMethods && selectedMethods.length === 2
                            }
                        />
                        {method === 'transfer' && 'Transferencia'}
                        {method === 'cash' && 'Efectivo'}
                        {method === 'check' && 'Cheque'}
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
