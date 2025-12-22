const FormInput = ({ label, type = "text", register, name, error ,placeholder,className}) => {
    return (
        <div>
            <label className="text-sm text-gray-900 font-medium ml-1 block">{label}</label>
            <input
            placeholder={placeholder}
                type={type}
                {...register(name)}
                className={className}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
};

export default FormInput;
