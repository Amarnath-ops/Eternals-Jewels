const FormWrapper = ({onSubmit, children,className, ...options})=>{
  return(
    <form onSubmit={onSubmit} className={`space-y-4 ${className }`} {...options}>
      {children}
    </form>
  )
}

export default FormWrapper;