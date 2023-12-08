import * as nextLog from 'next/dist/build/output/log';

const getOpenCollective = async (offset = 0, limit = 5000) => {
  const gql = `{
    accounts(
        tag: "hacktoberfest"
        type: [COLLECTIVE, PROJECT]
        isActive: true
        hasCustomContributionsEnabled: true
        offset: ${offset}
        limit: ${limit}
    ) {
        totalCount
        nodes {
            slug
            name
            description
            imageUrl
        }
    }
}`;

  const response = await fetch('https://opencollective.com/api/graphql/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: gql }),
  });
  if (!response.ok) {
    console.error(await response.text());
    throw new Error(
      `OpenCollective API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return {
    items: data.data.accounts.nodes.map((project) => ({
      source: 'OpenCollective',
      name: project.name,
      link: {
        title: `Support ${project.slug} via OpenCollective`,
        url: `https://opencollective.com/embed/${project.slug}/donate?disabledPaymentMethodTypes=MANUAL&tags=hacktoberfest`,
      },
      short: project.description,
      icon: project.imageUrl,
    })),
    more:
      data.data.accounts.totalCount >
      offset * limit + data.data.accounts.nodes.length,
  };
};

const getGitHub = async (token, cursor = '') => {
  const after = cursor ? `, after: "${cursor}"` : '';
  const gql = `{
    search(query: "topic:hacktoberfest is:sponsorable", type: REPOSITORY, first: 100${after}) {
        nodes {
            ... on Repository {
                name
                description
                owner {
                    avatarUrl
                }
                fundingLinks {
                    platform
                    url
                }
            }
        }
        pageInfo {
            hasNextPage
            endCursor
        }
    }
}`;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: gql }),
  });
  if (!response.ok)
    throw new Error(
      `GitHub Sponsors API error: ${response.status} ${response.statusText}`,
    );

  const data = await response.json();
  if (data.errors)
    throw new Error(
      `GitHub Sponsors API error: ${data.errors
        .map((e) => e.message)
        .join(', ')}`,
    );

  return {
    items: data.data.search.nodes
      .map((project) => ({
        source: 'GitHub Sponsors',
        name: project.name,
        link: project.fundingLinks
          .filter((link) => link.platform === 'GITHUB')
          .map((link) => ({
            title: `Support @${link.url.replace(
              /^https:\/\/github\.com\//,
              '',
            )} via GitHub Sponsors`,
            url: `https://github.com/sponsors/${link.url.replace(
              /^https:\/\/github\.com\//,
              '',
            )}?metadata_campaign=hacktoberfest`,
          })),
        short: project.description,
        icon: project.owner.avatarUrl,
      }))
      .filter((project) => project.link.length),
    more:
      data.data.search.pageInfo.hasNextPage &&
      data.data.search.pageInfo.endCursor,
  };
};

const fetchProjects = async () => {
  const results = [];

  // Fetch OpenCollective projects
  let offset = 0;
  while (true) {
    const response = await getOpenCollective(offset);
    results.push(...response.items);
    if (!response.more) break;
    offset++;
  }

  // Fetch GitHub Sponsors if token set
  if (process?.env?.GITHUB_TOKEN) {
    let cursor = null;
    while (true) {
      const response = await getGitHub(process.env.GITHUB_TOKEN, cursor);
      results.push(...response.items);
      if (!response.more) break;
      cursor = response.more;
    }
  } else {
    nextLog.warn('GITHUB_TOKEN not set, skipping GitHub Sponsors');
  }

  return results;
};

export default fetchProjects;
