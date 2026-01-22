import { Text, Card, Button } from '../../design-system/components';

export default function SalesHome() {
  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Sales Dashboard</Text>
      <Card>
        <Text>Welcome to the Sales experience. This is mobile-first with bottom actions.</Text>
        <Button>Action 1</Button>
        <Button variant="secondary">Action 2</Button>
      </Card>
    </div>
  );
}