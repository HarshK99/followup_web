import { Text, Card, Button } from '../../design-system/components';

export default function ManagerHome() {
  return (
    <div>
      <Text as="h1" size="xl" weight="bold">Manager Dashboard</Text>
      <Card>
        <Text>Welcome to the Manager experience. This is desktop-first with sidebar.</Text>
        <Button>Manage</Button>
        <Button variant="secondary">Reports</Button>
      </Card>
    </div>
  );
}