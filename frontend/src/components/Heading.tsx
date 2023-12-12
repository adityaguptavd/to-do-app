type HeadingProps = {
    title : string
}

export default function Heading({title} : HeadingProps) {
  return (
    <div className="box heading">
        <h1>{title}</h1>
    </div>
  )
}
