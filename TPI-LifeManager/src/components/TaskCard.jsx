import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const TaskCard= ({title, description, path, bgClass, imgSrc}) => {
  return (
    <Card className={`${bgClass} hover-scale p-4 rounded`} style={{ width: '18rem' }}>
      <Card.Img className="mx-auto d-block" variant="top" src={imgSrc} alt={`Imagen de ${title}`} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {description}
        </Card.Text>
        <Link to={path}>
            <Button variant="dark">{title}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;