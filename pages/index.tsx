import { Blocks } from "../components/blocks-renderer";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { client } from "../.tina/__generated__/client";

export default function IndexPage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const eventsData = props.events.eventConnection.edges
  const eventList = eventsData.map(event => {
    return (
      {
        eventName: event.node?.eventName,
        website: event.node?.website,
        location: event.node?.location,
        startDate: event.node?.startDate,
        endDate: event.node?.endDate,
        dateTBD: event.node?.dateTBD,
        dri: event.node?.dri,
        tag: event.node?.tag,
        juanSpeaking: event.node?.juanSpeaking,
      }
    )
  })

  return (
    /* TODO: needs ts type */
    <Layout rawData={data} data={data.global as any}>
      <Blocks {...data.page } events={eventList} />
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.contentQuery({
    relativePath: `index.md`,
  });
  const eventsListData = await client.queries.eventConnection({ last: -1 });
  return {
    props: {
      data: tinaProps.data,
      query: tinaProps.query,
      variables: tinaProps.variables,
      events: eventsListData.data
    },
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
