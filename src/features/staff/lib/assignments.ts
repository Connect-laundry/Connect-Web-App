export function getAssignmentTypes(assignmentType: string): Array<'PICKUP' | 'DELIVERY'> {
  if (assignmentType === 'BOTH') return ['PICKUP', 'DELIVERY']
  return [assignmentType as 'PICKUP' | 'DELIVERY']
}
