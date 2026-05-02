const FormInput = ({ label, type = "text", register, name, error ,placeholder,className,...options}) => {
    return (
        <div>
            <label className="text-sm text-gray-900 font-medium ml-1 block">{label}</label>
            <input
            placeholder={placeholder}
                type={type}
                {...register(name)}
                className={className}
                {...options}
            />
            {error && <p className="text-red-500 text-xs mt-1 w-full">{error.message}</p>}
        </div>
    );
};

export default FormInput;
