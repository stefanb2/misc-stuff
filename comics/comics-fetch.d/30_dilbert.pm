package ComicsFetch::dilbert;
use 5.030;
use strict;
use warnings;

use Date::Format;

sub get() {
    # Looks like that after the rucus dilbert.com got cancelled...
    # For now change the fetcher to a no-op.
    return;

    my @yesterday = localtime(get_time() - 86400);
    my $url       = strftime('https://dilbert.com/%Y-%m-%d',
                             @yesterday);
    ::get_comic_simple(
        $url,
        "dilbert",
        undef,
        class => "img-comic-container"
    );
}

1;
