import './Title.css';

const Title = ({ titulo, titulo2 }) => {
    return (
        <div className="title-group">
            {titulo &&
                <h1>
                    {titulo}
                </h1>
            }
            {titulo2 &&
                <h2>
                    {titulo2}
                </h2>
            }
        </div>
    );
};

export default Title;