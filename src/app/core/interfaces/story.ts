export interface Story
{
	id: string;
	narrative: string;
	substories: Story[];
}