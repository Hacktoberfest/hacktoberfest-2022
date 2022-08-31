import { council, lowNonCode } from 'lib/about';

const About = () => {
  return (
    <>
      <h1>About</h1>

      <div id="lore">
        <h2>Hacktoberfest Lore</h2>
        <p>
          Hacktoberfest is DigialOcean’s annual event that encourages people to contribute to open source throughout October.
          Much of modern tech infrastructure—including some of DigitalOcean’s own products—relies on open-source projects built and maintained by passionate people who often don’t have the staff or budgets to do much more than keep the project alive.
          Hacktoberfest is all about giving back to those projects, sharpening skills, and celebrating all things open source, especially the people that make open source so special.
        </p>
        <p>
          For the past 9 years, thousands of people—coders and non-coders alike—have participated in Hacktoberfest to support the projects they use and love, learn and practice skills that will enhance their careers, and meet new people who love open source as much as they do.
        </p>
      </div>

      <div>
        <h2>New for 2022</h2>
      </div>

      <div id="low-or-non-code">
        <h3>Low or Non Code Contributions</h3>
        <p>
          Contributing to open source isn’t just for technical folks who want to write code.
          There are lots of opportunities to use your professional skills in support of open-source projects.
          This year, we’re making a point to encourage contributions that require some technical experience or none at all.
          No matter your experience, you can participate in Hacktoberfest!
        </p>
        <p>
          Hacktoberfest welcomes people of any experience level to participate, and low-code and non-code contributions are fantastic choices for folks who don’t have a lot of technical knowledge.
          Here are some examples of ways you can contribute to open-source projects:
        </p>

        <table>
          <thead>
            <tr>
              <th />
              <th>Low-Code</th>
              <th>Non-Code</th>
            </tr>
          </thead>
          <tbody>
          {lowNonCode.map(row => (
            <tr key={row.title}>
              <td>{row.title}</td>
              <td>
                <ul>
                  {row.low.map(item => <li key={item}>{item}</li>)}
                </ul>
              </td>
              <td>
                <ul>
                  {row.non.map(item => <li key={item}>{item}</li>)}
                </ul>
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        <p>
          <i>
            **To accept Advocacy type contributions Maintainers will need to create a specific repo that acts as an activity log and accepts PRs/MRs.
          </i>
        </p>
      </div>

      <div id="council">
        <h2>Advisory Council</h2>
        <p>
          Each year, we bring together a talented group of open-source superfans who help ensure that Hacktoberfest is accessible, inclusive, and enriching for both contributors and maintainers.
        </p>

        <div>
          {council.map(member => (
            <div key={member.name}>
              <img src={member.image} alt={member.name} width={128} height={128} style={{ objectFit: "cover" }}  />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p>{member.skills}</p>
              <p>{member.bio}</p>
              {!!member.links.length && (
                <ul>
                  {member.links.map(link => (
                    <li key={link.title}>
                      <a href={link.url}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default About;
