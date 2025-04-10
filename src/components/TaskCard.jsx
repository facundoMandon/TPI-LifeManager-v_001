import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const TaskCard= ({title, description, path}) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {description}
        </Card.Text>
        <Link to={path}>
            <Button variant="primary">Ir a {title}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;